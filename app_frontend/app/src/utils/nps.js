const _toFixed = (num, fixed) => {
    // eslint-disable-next-line prefer-template
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?')
    return num.toString().match(re)[0]
}
const _getBuckets = (poll) => {
    let totalResp = 0
    let detractorsCount = 0
    let passiveCount = 0
    let promoterCount = 0
    poll.options.forEach(p => {
        totalResp += p.votes
        if (+p.option < 7) {
            detractorsCount += p.votes
        } else if (+p.option >= 7 && +p.option < 9) {
            passiveCount += p.votes
        } else {
            promoterCount += p.votes
        }
    })
    return {totalResp, detractorsCount, passiveCount, promoterCount}
}

const calculateNPSDetractors = (poll) => {
    const { totalResp, promoterCount, passiveCount } = _getBuckets(poll)
    if (totalResp === 0) {
        return 0
    }
    return _toFixed((((totalResp - (promoterCount + passiveCount)) / totalResp) * 100), 2)
}
const calculateNPSPassives = (poll) => {
    const { totalResp, promoterCount, detractorsCount } = _getBuckets(poll)
    if (totalResp === 0) {
        return 0
    }
    return _toFixed((((totalResp - (promoterCount + detractorsCount)) / totalResp) * 100), 2)
}
const calculateNPSPromoters = (poll) => {
    const { totalResp, passiveCount, detractorsCount } = _getBuckets(poll)
    if (totalResp === 0) {
        return 0
    }
    return _toFixed((((totalResp - (passiveCount + detractorsCount)) / totalResp) * 100), 2)
}

const calculateNPSScore = (poll) => {
    const { totalResp, promoterCount, detractorsCount } = _getBuckets(poll)
    if (totalResp === 0) {
        return 0
    }
    const percentPromoters = (promoterCount / totalResp) * 100
    const percentDetractors = (detractorsCount / totalResp) * 100
    const diff = (percentPromoters - percentDetractors)
    return _toFixed(diff, 2)
}

const getTotalVotesCount = poll => {
    let totalVotes = 0
    poll.options.forEach(p => {
        totalVotes += p.votes
    })
    return totalVotes
}

export { calculateNPSScore, calculateNPSDetractors, calculateNPSPassives, calculateNPSPromoters, getTotalVotesCount }