-- Enable RLS
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "booking_select" ON "Booking"
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "booking_insert" ON "Booking"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "booking_update" ON "Booking"
FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "booking_delete" ON "Booking"
FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- Create Index
CREATE INDEX "idx_booking_userid" ON "Booking"("userId");