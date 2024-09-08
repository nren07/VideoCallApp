class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            'stun:stun.l.google.com:19302',
                            'stun:global.stun.twilio.com:3478',
                        ],
                    },
                    // Optionally add TURN servers here
                    // {
                    //     urls: 'turn:your.turn.server',
                    //     credential: 'yourTurnCredential',
                    //     username: 'yourTurnUsername'
                    // }
                ],
                iceTransportPolicy: 'all',
                bundlePolicy: 'balanced',
                rtcpMuxPolicy: 'require',
                iceCandidatePoolSize: 0,
            });

            this.peer.onicecandidate = (event) => {
                if (event.candidate) {
                    // Implement this function to send ICE candidates to the remote peer
                    this.sendCandidateToRemotePeer(event.candidate);
                }
            };

            this.peer.oniceconnectionstatechange = () => {
                console.log('ICE Connection State:', this.peer.iceConnectionState);
            };

            this.peer.onconnectionstatechange = () => {
                console.log('Connection State:', this.peer.connectionState);
            };
        }
    }

    async setRemoteDescription(description) {
        if (this.peer) {
            try {
                await this.peer.setRemoteDescription(description);
            } catch (error) {
                console.error('Error setting remote description:', error);
            }
        }
    }

    async getAnswer(offer) {
        if (this.peer) {
            try {
                await this.peer.setRemoteDescription(offer);
                const answer = await this.peer.createAnswer();
                await this.peer.setLocalDescription(new RTCSessionDescription(answer));
                console.log('Answer created:', answer);
                return answer;
            } catch (error) {
                console.error('Error creating answer:', error);
            }
        }
    }

    async getOffer() {
        if (this.peer) {
            try {
                const offer = await this.peer.createOffer();
                await this.peer.setLocalDescription(new RTCSessionDescription(offer));
                console.log('Offer created:', offer);
                return offer;
            } catch (error) {
                console.error('Error creating offer:', error);
            }
        }
    }

    async handleRemoteCandidate(candidate) {
        if (this.peer) {
            try {
                await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        }
    }

    // Implement this function to handle sending ICE candidates to the remote peer
    sendCandidateToRemotePeer(candidate) {
        // Example implementation: send the candidate via signaling server
        console.log('Sending ICE candidate to remote peer:', candidate);
        // signalingChannel.send({ type: 'candidate', candidate });
    }
}

export default new PeerService();
