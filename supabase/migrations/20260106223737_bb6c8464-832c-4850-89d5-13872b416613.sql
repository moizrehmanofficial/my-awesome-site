-- Create table for storing OTPs
CREATE TABLE public.contact_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  file_name TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_contact_otps_email ON public.contact_otps(email);

-- Enable RLS
ALTER TABLE public.contact_otps ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for sending OTP)
CREATE POLICY "Allow anonymous insert" 
ON public.contact_otps 
FOR INSERT 
WITH CHECK (true);

-- Allow anonymous select (for verifying OTP)
CREATE POLICY "Allow anonymous select" 
ON public.contact_otps 
FOR SELECT 
USING (true);

-- Allow anonymous delete (for cleanup after verification)
CREATE POLICY "Allow anonymous delete" 
ON public.contact_otps 
FOR DELETE 
USING (true);

-- Auto-cleanup expired OTPs (optional trigger)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.contact_otps WHERE expires_at < now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER cleanup_otps_on_insert
AFTER INSERT ON public.contact_otps
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_expired_otps();