import firebase from 'firebase/compat/app';
import { firestore, serverTimestamp } from './firebase';
import { Notification } from '../types';

export const createNotification = async (userId: string, message: string, type: Notification['type']): Promise<void> => {
  const notificationsRef = firestore.collection('notifications');

  // Query for existing notifications outside the transaction to resolve the type error.
  const userNotificationsQuery = notificationsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'asc');
  
  const snapshot = await userNotificationsQuery.get();

  await firestore.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const newNotificationRef = notificationsRef.doc();
      transaction.set(newNotificationRef, {
          userId,
          message,
          type,
          isRead: false,
          createdAt: serverTimestamp(),
      });

      const MAX_NOTIFICATIONS = 5;
      if (snapshot.size >= MAX_NOTIFICATIONS) {
          const numToDelete = snapshot.size - MAX_NOTIFICATIONS + 1;
          const docsToDelete = snapshot.docs.slice(0, numToDelete);
          docsToDelete.forEach(doc => {
              transaction.delete(doc.ref);
          });
      }
  });
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = firestore.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');
  const snapshot = await q.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const getUnreadNotifications = async (userId: string): Promise<Notification[]> => {
  const q = firestore.collection('notifications')
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .orderBy('createdAt', 'desc');
  const snapshot = await q.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await firestore.collection('notifications').doc(notificationId).update({
    isRead: true,
  });
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    const batch = firestore.batch();
    const q = firestore.collection('notifications')
        .where('userId', '==', userId)
        .where('isRead', '==', false);
    const snapshot = await q.get();
      
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
};