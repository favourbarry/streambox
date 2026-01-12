export const livestreamSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("join_livestream", (livestreamId) => {
            socket.join('livestream_${livestreamId}');
        });
        socket.on("send_message", ({ livestreamId, message}) => {
            socket.join('livestream_${livestreamId}');
        });

        socket.on("send_message", ({livestreamId, message}) => {
            io.to('livestream_${livestreamId}').emit("new_message", {
                user: socket.user,
                message
            });
        });
    });
}