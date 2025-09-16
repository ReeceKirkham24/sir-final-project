const db = require('../db/connect')

class Issues{
    constructor({ticketId, textContent, severityLevel, userId}){
        this.ticketId = ticketId;
        this.textContent = textContent;
        this.severityLevel = severityLevel;
        this.userId = userId;
    }
}