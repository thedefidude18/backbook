import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalRewards: number;
}