export const checkinTimeBiggerThanCheckoutTime = (checkinTime, checkoutTime) => {
    if (checkinTime && checkoutTime) {
        let checkin = {hours: checkinTime.substring(0,2), minutes: checkinTime.substring(3,5)}
        let checkout = {hours: checkoutTime.substring(0,2), minutes: checkoutTime.substring(3,5)}
        if (Number(checkin.hours) > Number(checkout.hours)) {
            return true;
        } else return Number(checkin.hours) == Number(checkout.hours) && Number(checkin.minutes) >= Number(checkout.minutes);
    }
}
