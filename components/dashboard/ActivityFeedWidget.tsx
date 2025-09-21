import React from 'react';
import { UserActivity } from '../../types';
import ActivityFeed from '../ActivityFeed';

interface ActivityFeedWidgetProps {
    activity: UserActivity[];
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ activity }) => {
    return <ActivityFeed activity={activity} />;
};

export default ActivityFeedWidget;
