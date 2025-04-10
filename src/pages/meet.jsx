import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VideoCall = () => {
  const { room } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  // Dynamically load the Jitsi script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      setJitsiLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Initialize Jitsi after the script has loaded
  useEffect(() => {
    if (!jitsiLoaded || !window.JitsiMeetExternalAPI) return;

    const domain = "meet.jit.si";
    const options = {
      roomName: room || `crm-call-room-${Date.now()}`,
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: "CRM User",
      },
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    api.addEventListener("videoConferenceLeft", () => {
      navigate("/dashboard");
    });

    return () => {
      api.dispose();
    };
  }, [jitsiLoaded, room, navigate]);

  return (
    <div ref={jitsiContainerRef} style={{ height: "100vh", width: "100%" }} />
  );
};

export default VideoCall;
