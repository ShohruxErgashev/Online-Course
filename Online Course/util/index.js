import moment from "moment/moment.js";

export default {
    ifequal(a, b, options) {
        if (a==b) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    // getFullNameFirsyCharacter (firstName, lastName) {
    //     return firstName.charAt(0) + lastName.charAt(0);
    // },

    formatDate(date) {
        return moment(date).format('DD MMM, YYYY');
    }

};

