export class Target {
  public id!: string;
  public liid!: string;
  public targetCode!: string;
  public from!: string;
  public to!: string;
  public comment!: string;
  public description!: string;
  public monitoredNumber?: string;
  public subscriber?: string;
  public msisdn?: string;
  public imei?: string;
  public imsi?: string;
  public transcriptionLang!: string;
  public transcriptionActive!: boolean;
}
