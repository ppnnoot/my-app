const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API || 'https://uapi.rg.in.th/uapi/rantcar/';

export const createBooking = async (bookingData) => {
  const response = await fetch(`${baseApiUrl}booking`, {
    method: 'POST',
    body: bookingData,

  });

  return response.json();
};

