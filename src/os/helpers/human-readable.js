module.exports = {
    delay: function (milliseconds) {
        if (milliseconds > 1000) {
            var seconds = Math.floor(milliseconds/1000);

            if (seconds > 120) {
                var minutes = Math.floor(seconds % 60);
                return minutes+'min';
            } else {
                return seconds+'s';
            }
        } else {
            return milliseconds+'ms';
        }
    }
};
