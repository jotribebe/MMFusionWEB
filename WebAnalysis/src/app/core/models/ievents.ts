export interface IEvents {
  id: string;
  priority: number;
  note?: string;
  transcription?: string;
  translation?: string;
  liid: string;
  targetCode: string;
  direction: number;
  source?: IProfile;
  destination?: IProfile;
  connectedTo?: IProfile;
  host?: string;
  metas: Array<IMetaData>;
  content: string;
  // "cin": "string",
  // "caller": {
  //   "imsi": {
  //     "mcc": "string",
  //     "mnc": "string",
  //     "msin": "string"
  //   },
  //   "imei": {
  //     "tac": "string",
  //     "snr": "string",
  //     "ctrl": "string"
  //   },
  //   "mSiSDN": {
  //     "countryCode": "string",
  //     "nationalDestinationCode": "string",
  //     "subscriberNumber": "string",
  //     "isTarget": true
  //   },
  //   "numberSubscriber": {
  //     "gender": 0,
  //     "lastName": "string",
  //     "firstName": "string",
  //     "fullName": "string",
  //     "location": [
  //       {
  //         "description": "string",
  //         "latitude": 0,
  //         "longitude": 0,
  //         "address": "string",
  //         "zip": "string",
  //         "city": "string",
  //         "country": "string"
  //       }
  //     ],
  //     "photos": [
  //       {
  //         "dataBase64": "string",
  //         "mediaType": 0
  //       }
  //     ]
  //   },
  //   "identity": {
  //     "gender": 0,
  //     "lastName": "string",
  //     "firstName": "string",
  //     "fullName": "string",
  //     "location": [
  //       {
  //         "description": "string",
  //         "latitude": 0,
  //         "longitude": 0,
  //         "address": "string",
  //         "zip": "string",
  //         "city": "string",
  //         "country": "string"
  //       }
  //     ],
  //     "photos": [
  //       {
  //         "dataBase64": "string",
  //         "mediaType": 0
  //       }
  //     ]
  //   },
  //   "location": [
  //     {
  //       "description": "string",
  //       "latitude": 0,
  //       "longitude": 0,
  //       "address": "string",
  //       "zip": "string",
  //       "city": "string",
  //       "country": "string"
  //     }
  //   ]
  // },
  // "callee": {
  //   "imsi": {
  //     "mcc": "string",
  //     "mnc": "string",
  //     "msin": "string"
  //   },
  //   "imei": {
  //     "tac": "string",
  //     "snr": "string",
  //     "ctrl": "string"
  //   },
  //   "mSiSDN": {
  //     "countryCode": "string",
  //     "nationalDestinationCode": "string",
  //     "subscriberNumber": "string",
  //     "isTarget": true
  //   },
  //   "numberSubscriber": {
  //     "gender": 0,
  //     "lastName": "string",
  //     "firstName": "string",
  //     "fullName": "string",
  //     "location": [
  //       {
  //         "description": "string",
  //         "latitude": 0,
  //         "longitude": 0,
  //         "address": "string",
  //         "zip": "string",
  //         "city": "string",
  //         "country": "string"
  //       }
  //     ],
  //     "photos": [
  //       {
  //         "dataBase64": "string",
  //         "mediaType": 0
  //       }
  //     ]
  //   },
  //   "identity": {
  //     "gender": 0,
  //     "lastName": "string",
  //     "firstName": "string",
  //     "fullName": "string",
  //     "location": [
  //       {
  //         "description": "string",
  //         "latitude": 0,
  //         "longitude": 0,
  //         "address": "string",
  //         "zip": "string",
  //         "city": "string",
  //         "country": "string"
  //       }
  //     ],
  //     "photos": [
  //       {
  //         "dataBase64": "string",
  //         "mediaType": 0
  //       }
  //     ]
  //   },
  //   "location": [
  //     {
  //       "description": "string",
  //       "latitude": 0,
  //       "longitude": 0,
  //       "address": "string",
  //       "zip": "string",
  //       "city": "string",
  //       "country": "string"
  //     }
  //   ]
  // },
  dateTime: string;
  groupType: number;
  type: number;
  autoTranslation?: string;
  isRead: boolean;
  // "length": 0,
  // "connectedTo": {
  //   "imsi": {
  //     "mcc": "string",
  //     "mnc": "string",
  //     "msin": "string"
  //   },
  //   "imei": {
  //     "tac": "string",
  //     "snr": "string",
  //     "ctrl": "string"
  //   },
  //   "mSiSDN": {
  //     "countryCode": "string",
  //     "nationalDestinationCode": "string",
  //     "subscriberNumber": "string",
  //     "isTarget": true
  //   },
  //   "numberSubscriber": {
  //     "gender": 0,
  //     "lastName": "string",
  //     "firstName": "string",
  //     "fullName": "string",
  //     "location": [
  //       {
  //         "description": "string",
  //         "latitude": 0,
  //         "longitude": 0,
  //         "address": "string",
  //         "zip": "string",
  //         "city": "string",
  //         "country": "string"
  //       }
  //     ],
  //     "photos": [
  //       {
  //         "dataBase64": "string",
  //         "mediaType": 0
  //       }
  //     ]
  //   },
  //   "identity": {
  //     "gender": 0,
  //     "lastName": "string",
  //     "firstName": "string",
  //     "fullName": "string",
  //     "location": [
  //       {
  //         "description": "string",
  //         "latitude": 0,
  //         "longitude": 0,
  //         "address": "string",
  //         "zip": "string",
  //         "city": "string",
  //         "country": "string"
  //       }
  //     ],
  //     "photos": [
  //       {
  //         "dataBase64": "string",
  //         "mediaType": 0
  //       }
  //     ]
  //   },
  //   "location": [
  //     {
  //       "description": "string",
  //       "latitude": 0,
  //       "longitude": 0,
  //       "address": "string",
  //       "zip": "string",
  //       "city": "string",
  //       "country": "string"
  //     }
  //   ]
  // },
  // "callChain": [
  //   {
  //     "countryCode": "string",
  //     "nationalDestinationCode": "string",
  //     "subscriberNumber": "string",
  //     "isTarget": true
  //   }
  // ],
  // "sourceEndPoint": {
  //   "addressFamily": 0,
  //   "address": {
  //     "addressFamily": 0,
  //     "scopeId": 0,
  //     "isIPv6Multicast": true,
  //     "isIPv6LinkLocal": true,
  //     "isIPv6SiteLocal": true,
  //     "isIPv6Teredo": true,
  //     "isIPv6UniqueLocal": true,
  //     "isIPv4MappedToIPv6": true
  //   },
  //   "port": 0
  // },
  // "sourceLocation": [
  //   {
  //     "description": "string",
  //     "latitude": 0,
  //     "longitude": 0,
  //     "address": "string",
  //     "zip": "string",
  //     "city": "string",
  //     "country": "string"
  //   }
  // ],
  // "destinationEndPoint": {
  //   "addressFamily": 0,
  //   "address": {
  //     "addressFamily": 0,
  //     "scopeId": 0,
  //     "isIPv6Multicast": true,
  //     "isIPv6LinkLocal": true,
  //     "isIPv6SiteLocal": true,
  //     "isIPv6Teredo": true,
  //     "isIPv6UniqueLocal": true,
  //     "isIPv4MappedToIPv6": true
  //   },
  //   "port": 0
  // },
  // "destinationLocation": [
  //   {
  //     "description": "string",
  //     "latitude": 0,
  //     "longitude": 0,
  //     "address": "string",
  //     "zip": "string",
  //     "city": "string",
  //     "country": "string"
  //   }
  // ],
  // "contentAccess": 0,
  // "content": "string",
  // "leftChannelPoints": [
  //   {
  //     "timing": 0,
  //     "value": 0
  //   }
  // ],
  // "rightChannelPoints": [
  //   {
  //     "timing": 0,
  //     "value": 0
  //   }
  // ],
  // "sipMessages": [
  //   {
  //     "direction": 0,
  //     "tokenType": "string",
  //     "cSeqCounter": 0,
  //     "cSeq": "string",
  //     "callId": "string",
  //     "from": {
  //       "number": "string",
  //       "uri": "string",
  //       "imei": "string",
  //       "imsi": "string"
  //     },
  //     "to": {
  //       "number": "string",
  //       "uri": "string",
  //       "imei": "string",
  //       "imsi": "string"
  //     },
  //     "contact": {
  //       "number": "string",
  //       "uri": "string",
  //       "imei": "string",
  //       "imsi": "string"
  //     },
  //     "_SipMessage": "string",
  //     "tokens": [
  //       "string"
  //     ],
  //     "footPrint": "string",
  //     "fromSBC": true,
  //     "sbcIpAddress": {
  //       "addressFamily": 0,
  //       "scopeId": 0,
  //       "isIPv6Multicast": true,
  //       "isIPv6LinkLocal": true,
  //       "isIPv6SiteLocal": true,
  //       "isIPv6Teredo": true,
  //       "isIPv6UniqueLocal": true,
  //       "isIPv4MappedToIPv6": true
  //     }
  //   }
  // ]
  labels?: Array<string>;
}

export interface IProfile {
  imsi?: IMSI;
  imei?: IMEI;
  mSiSDN?: MSiSDN;
  endPoint?: EndPoint;
  cellHandovers?: Array<ICellLocation>;
  isTarget: boolean;
}

export interface IMSI {
  mcc: string;
  mnc: string;
  msin: string;
}

export interface IMEI {
  tac: string;
  snr: string;
  ctrl: string;
}

export interface MSiSDN {
  countryCode?: string;
  nationalDestinationCode?: string;
  subscriberNumber?: string;
}

export interface EndPoint {
  port: string;
}

export interface ICellLocation {
  cellId: number;
  globalCellId?: string;
  cellAddress?: string;
  cellZip?: string;
  cellLatitude?: number;
  cellLongitude?: number;
}

export interface IMetaData {
  group: string;
  value: string;
  name: string;
}

export interface IEventsResult {
  result: Array<IEvents>;
  count: number;
}

export interface IFiltersEventsRequest {
  skip: number;
  take: number;
  targets: string[];
  globalSearch?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterModel: any;
}

export interface Identity {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: string;
  birthDate?: string;
  photos?: Array<string>;
  idCardNumber?: string;
  idCartType?: string;
  passportNumber?: string;
}
