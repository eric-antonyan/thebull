export type Request = {
    _id?: string;
    fullName: string,
    company: string,
    email: string,
    phoneNumber: string,
    country: string,
    address: string,
    accepted?: boolean
}