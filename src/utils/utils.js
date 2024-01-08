
export const trimAddress = (addr) => {
    return `${addr.substring(0, 7)}...${addr.substring(addr.length - 5)}`;
};

export function formatNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    } else {
        return num.toFixed(2);
    }
}

export const displayRemainTime = (seconds) => {
    // console.log('dRT: ', seconds)
    if (seconds > 0) {
        // Calculating the days, hours, minutes and seconds left
        const timeDays = Math.floor(seconds / (60 * 60 * 24))
        const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
        const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)
        const timeSeconds = Math.floor(seconds % 60)

        if (timeDays > 0) {
            return `${timeDays}D ${timeHours}H ${timeMinutes}M ${timeSeconds}S`
        } else if (timeHours > 0) {
            return `${timeHours}H ${timeMinutes}M ${timeSeconds}S`
        } else if (timeMinutes > 0) {
            return `${timeMinutes}M ${timeSeconds}S`
        } else if (timeSeconds > 0) {
            return `${timeSeconds}S`
        }
    }

    return `--`
}

export const displayTimeAmount = (seconds) => {
    // console.log('dTA: ', seconds)
    let retString = "";
    if (seconds > 0) {
        // Calculating the days, hours, minutes and seconds left
        const timeDays = Math.floor(seconds / (60 * 60 * 24))
        const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
        const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)
        const timeSeconds = Math.floor(seconds % 60)

        if (timeDays > 0) {
            retString = `${timeDays} Days`
        }
        if (timeHours > 0) {
            retString = `${retString} ${timeHours} Hours`
        }
        if (timeMinutes > 0) {
            retString = `${retString} ${timeMinutes} Minutes`
        }
        if (timeSeconds > 0) {
            retString = `${retString} ${timeSeconds} Seconds`
        }
        return retString;
    }

    return `--`
}

export function getDefaultGas() {
    return global.defaultGas
}

export function getMaxValue(tokenBalance, isNative) {
    if (isNative) {
        const defaultGas = getDefaultGas()
        return tokenBalance - defaultGas
    }

    return tokenBalance
}

export function delayMs(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
        // console.log(`${ms}ms delay...`)
    });
}

export function isSupportedChain(chain) {
    if (!chain) return false;
    return global.chain.id === chain.id;
}
