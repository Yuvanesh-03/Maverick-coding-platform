
import firebase from 'firebase/compat/app';
import { firestore, serverTimestamp } from './firebase';
import { DiscussionThread, DiscussionReply, DiscussionCategory, DiscussionDifficulty, DiscussionStatus, DiscussionLanguage } from '../types';

export const createThread = async (threadData: Omit<DiscussionThread, 'id' | 'timestamp' | 'replyCount' | 'upvotes' | 'downvotes' | 'upvotedBy' | 'downvotedBy' | 'repliedBy'>): Promise<string> => {
  const docRef = await firestore.collection('discussions').add({
    ...threadData,
    replyCount: 0,
    timestamp: serverTimestamp(),
    upvotes: 0,
    downvotes: 0,
    upvotedBy: [],
    downvotedBy: [],
    repliedBy: [],
  });
  return docRef.id;
};

export interface GetThreadsFilters {
    category: 'All Categories' | DiscussionCategory;
    language: 'All Languages' | DiscussionLanguage;
    difficulty: 'All Levels' | DiscussionDifficulty;
    status: 'All Posts' | DiscussionStatus;
    sortBy: 'Newest' | 'Top' | 'Most Replies';
    scope: 'All Threads' | 'My Threads' | 'My Replies';
}

export const getThreads = async (filters: GetThreadsFilters, userId: string): Promise<DiscussionThread[]> => {
    let q: firebase.firestore.Query<firebase.firestore.DocumentData> = firestore.collection('discussions');

    if (filters.scope === 'My Threads') {
      q = q.where('authorId', '==', userId);
    }
    if (filters.scope === 'My Replies') {
      q = q.where('repliedBy', 'array-contains', userId);
    }
    if (filters.category !== 'All Categories') {
        q = q.where('category', '==', filters.category);
    }
    if (filters.language !== 'All Languages') {
        q = q.where('language', '==', filters.language);
    }
    if (filters.difficulty !== 'All Levels') {
        q = q.where('difficulty', '==', filters.difficulty);
    }
    if (filters.status !== 'All Posts') {
        q = q.where('status', '==', filters.status);
    }

    if (filters.sortBy === 'Top') {
      q = q.orderBy('upvotes', 'desc');
    } else if (filters.sortBy === 'Most Replies') {
        q = q.orderBy('replyCount', 'desc');
    } else {
        q = q.orderBy('timestamp', 'desc');
    }

    const snapshot = await q.get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiscussionThread));
};

export const getThreadWithReplies = async (threadId: string): Promise<{ thread: DiscussionThread; replies: DiscussionReply[] } | null> => {
    const threadRef = firestore.collection('discussions').doc(threadId);
    const threadSnap = await threadRef.get();

    if (!threadSnap.exists) {
        return null;
    }

    const repliesRef = threadRef.collection('replies');
    const repliesQuery = repliesRef.orderBy('timestamp', 'asc');
    const repliesSnap = await repliesQuery.get();

    const thread = { id: threadSnap.id, ...threadSnap.data() } as DiscussionThread;
    const replies = repliesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiscussionReply));

    return { thread, replies };
};

export const addReply = async (threadId: string, replyData: Omit<DiscussionReply, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'upvotedBy' | 'downvotedBy'>): Promise<void> => {
    const threadRef = firestore.collection('discussions').doc(threadId);
    const repliesCollectionRef = threadRef.collection('replies');
    const newReplyRef = repliesCollectionRef.doc(); // Create a new doc reference with a generated ID

    await firestore.runTransaction(async (transaction) => {
        transaction.set(newReplyRef, {
            ...replyData,
            timestamp: serverTimestamp(),
            upvotes: 0,
            downvotes: 0,
            upvotedBy: [],
            downvotedBy: [],
        });
        transaction.update(threadRef, {
            replyCount: firebase.firestore.FieldValue.increment(1),
            repliedBy: firebase.firestore.FieldValue.arrayUnion(replyData.authorId),
        });
    });
};


export const deleteThread = async (threadId: string): Promise<void> => {
  const threadRef = firestore.collection('discussions').doc(threadId);
  const repliesRef = threadRef.collection('replies');
  
  const batch = firestore.batch();

  // Delete all replies in the subcollection
  const repliesSnapshot = await repliesRef.get();
  repliesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  // Delete the thread itself
  batch.delete(threadRef);
  
  await batch.commit();
};

export const deleteReply = async (threadId: string, replyId: string): Promise<void> => {
  const threadRef = firestore.collection('discussions').doc(threadId);
  const replyRef = threadRef.collection('replies').doc(replyId);
  
  await firestore.runTransaction(async (t) => {
    const threadDoc = await t.get(threadRef);
    if (threadDoc.exists) {
        t.delete(replyRef);
        const currentCount = threadDoc.data()?.replyCount || 0;
        if (currentCount > 0) {
            t.update(threadRef, { replyCount: firebase.firestore.FieldValue.increment(-1) });
        }
    } else {
        t.delete(replyRef);
    }
  });
};

const handleVote = async (docRef: firebase.firestore.DocumentReference, userId: string, voteType: 'up' | 'down') => {
  await firestore.runTransaction(async (t) => {
      const docSnap = await t.get(docRef);
      if (!docSnap.exists) return;

      const data = docSnap.data() as { upvotedBy: string[], downvotedBy: string[], upvotes: number, downvotes: number };
      const upvotedBy = data.upvotedBy || [];
      const downvotedBy = data.downvotedBy || [];

      const isUpvoted = upvotedBy.includes(userId);
      const isDownvoted = downvotedBy.includes(userId);

      const updates: { [key: string]: any } = {};

      if (voteType === 'up') {
          if (isUpvoted) {
              updates.upvotedBy = firebase.firestore.FieldValue.arrayRemove(userId);
              updates.upvotes = firebase.firestore.FieldValue.increment(-1);
          } else {
              updates.upvotedBy = firebase.firestore.FieldValue.arrayUnion(userId);
              updates.upvotes = firebase.firestore.FieldValue.increment(1);
              if (isDownvoted) {
                  updates.downvotedBy = firebase.firestore.FieldValue.arrayRemove(userId);
                  updates.downvotes = firebase.firestore.FieldValue.increment(-1);
              }
          }
      } else { // voteType === 'down'
          if (isDownvoted) {
              updates.downvotedBy = firebase.firestore.FieldValue.arrayRemove(userId);
              updates.downvotes = firebase.firestore.FieldValue.increment(-1);
          } else {
              updates.downvotedBy = firebase.firestore.FieldValue.arrayUnion(userId);
              updates.downvotes = firebase.firestore.FieldValue.increment(1);
              if (isUpvoted) {
                  updates.upvotedBy = firebase.firestore.FieldValue.arrayRemove(userId);
                  updates.upvotes = firebase.firestore.FieldValue.increment(-1);
              }
          }
      }
      t.update(docRef, updates);
  });
};

export const voteOnThread = async (threadId: string, userId: string, voteType: 'up' | 'down'): Promise<void> => {
  const threadRef = firestore.collection('discussions').doc(threadId);
  await handleVote(threadRef, userId, voteType);
};

export const voteOnReply = async (threadId: string, replyId: string, userId: string, voteType: 'up' | 'down'): Promise<void> => {
  const replyRef = firestore.collection('discussions').doc(threadId).collection('replies').doc(replyId);
  await handleVote(replyRef, userId, voteType);
};
