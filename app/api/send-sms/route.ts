import { NextResponse } from "next/server";
import { Twilio } from "twilio";

export async function POST(request: Request) {
  try {
    // Parse the JSON body from the incoming request
    const { recipient, message } = await request.json();

    // Validate that the required fields are present
    if (!recipient || !message) {
      return NextResponse.json(
        { success: false, error: "Missing recipient or message" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    const client = new Twilio(accountSid, authToken);

    // Trigger the Twilio SMS
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: recipient,
    });

    return NextResponse.json({ success: true, sid: response.sid }, { status: 200 });

  } catch (error) {
    console.error("SMS API Error:", error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}