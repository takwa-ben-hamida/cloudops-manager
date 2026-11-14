export class CreateServerDto {
  name: string;
  provider: string;
  region: string;
  cpu: number;
  ram: number;
  storage: number;
  ipAddress: string;
  status: string;
}