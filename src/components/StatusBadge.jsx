import React from 'react';
import { Badge } from './ui/badge';



const StatusBadge = ({ status }) => {
  return (
    <Badge variant={status}>{status}</Badge>
  );
};

export default StatusBadge;
