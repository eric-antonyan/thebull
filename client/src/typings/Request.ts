export type Request = {
  _id?: string;
  sub: string;
  fullName: string;
  company: string;
  email: string;
  phoneNumber: string;
  country: string;
  address: string;
  city?: string;
  profession?: string;
  accepted?: boolean;
};
