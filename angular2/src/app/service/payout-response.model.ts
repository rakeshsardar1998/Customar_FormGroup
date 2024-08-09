export interface PayoutResponse {
	[x: string]: any;
    status: string;
    data: any; // Adjust the type of `data` based on the actual structure of your response
}