import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useRealTimeSync = (hostelId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!hostelId) return;

    // Create STOMP client over SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-hostelpay'),
      debug: (str) => console.log('STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to Real-Time Sync');

      // Subscribe to payment updates
      client.subscribe(`/topic/hostel/${hostelId}/payments`, (message) => {
        console.log('Payment update received:', message.body);
        queryClient.invalidateQueries(['payments']);
        queryClient.invalidateQueries(['dashboard-metrics']);
      });

      // Subscribe to notice updates
      client.subscribe(`/topic/hostel/${hostelId}/notices`, (message) => {
        console.log('New notice received:', message.body);
        queryClient.invalidateQueries(['notices']);
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [hostelId, queryClient]);
};
