import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { adminApi } from '../../redux/api/employeeApi';
import { useSelector } from 'react-redux';

const VideoPlayer = () => {
  const { roomId } = useParams();
  const [employee, setEmployee] = useState([]);
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const zegoRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchReport();
    } else {
      setEmployee([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      cleanupZego();
    };
  }, []);

  const cleanupZego = () => {
    if (zegoRef.current) {
      try {
        zegoRef.current.stopRecording();
        zegoRef.current.leaveRoom();
        zegoRef.current.destroy();
      } catch (error) {
        console.error('Error cleaning up Zego:', error);
      }
    }
  };

  const fetchReport = async () => {
    try {
      const response = await adminApi.userDetails();
      const data = response.employee;
      console.log(data);
      setEmployee(data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const myMeeting = async (element) => {
    if (!employee || !employee.first_name) {
      console.log('User data is incomplete or not available yet');
      return;
    }

    const appID = 905303586;
    const serverSecret = '041dd5548a2d9e1f8ba6380c45671395';
    const { first_name } = employee;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      first_name
    );

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zegoRef.current = zc;

    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };

  useEffect(() => {
    if (employee && employee.first_name) {
      const element = document.getElementById('videoContainer');
      myMeeting(element);
    }
  }, [employee, roomId]);

  return (
    <div>
      {employee && employee.first_name ? (
        <div id="videoContainer" />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default VideoPlayer;
