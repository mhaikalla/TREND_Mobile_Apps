//const URI =  'http://qaapps.trakindo.co.id/Trend/'
//const URI = 'http://devapps.trakindo.co.id/Trend/'
 //const URI = 'https://apps.dipstrategy.com/trakindotsics/api/mobile/'
const URI = 'http://trend.trakindo.co.id/'


const API = {
    getMyTR : URI + 'api/mobile/mytickets',
    getAllTR : URI + 'api/mobile/tickets',
    getDataSerial : URI + 'api/mobile/mepsuggestion?SN=',
    getListResponder : URI + 'api/mobile/respondersuggestion?xupj=',
    getDataEMP : URI + 'api/mobile/mep?SN=',
    getTicketNumber : URI + 'api/mobile/ticketnumber?categoryId=',
    getListParticipant : URI + 'api/mobile/participantssuggestion?xupj=',
    registerProduct : URI + 'api/mobile/producthealth',
    registerDimension : URI + 'api/mobile/dimension',
    registerReference : URI + 'api/mobile/reference',
    registerGoodwill : URI + 'api/mobile/goodwill',
    registerWarranty: URI + 'api/mobile/warranty',
    registerPassword: URI + 'api/mobile/password',
    registerDppm: URI + 'api/mobile/dppm',
    registerTelematics: URI + 'api/mobile/telematics',
    registerHelpDesk: URI + 'api/mobile/help',
    registerCondition: URI + 'api/mobile/conditionmonitoring',
    registerPartsTechnical: URI + 'api/mobile/partstechnical',
    deleteTicket: URI + 'api/mobile/deleteticket?ticketId=',
    getWarrantytype: URI + 'api/mobile/warrantytype',
    getDiscuss: URI + 'api/mobile/discussion?ticketId=',
    postDiscuss: URI + 'api/mobile/discussion',
    getTiketDetail:  URI + 'api/mobile/ticketdetail?ticketId=',
    searchDataAll: URI + 'api/mobile/search?searchString=',
    searchDataMy: URI + 'api/mobile/searchMyTR?searchString=',
    getName: URI + 'api/mobile/getemployeename',
    postResolution: URI + 'api/mobile/resolution',
    postEscalate: URI + 'api/mobile/escalate',
    postRateResponder: URI + 'api/mobile/rateresponder',
    discusFormBody: URI + 'api/mobile/discussionform',
    generatePassword: URI + 'TechnicalRequest/GenerateCatElectronicTechniciann/',
    login: URI + 'api/MobileLogin',
    GuideLink: URI + 'Upload/TREND-User-Guide.pdf',
    Version : '1.2.0'
};

export default API;