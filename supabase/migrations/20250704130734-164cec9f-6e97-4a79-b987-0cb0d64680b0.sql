-- Disable RLS on stock_data table since it should be publicly readable
ALTER TABLE stock_data DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create a policy to allow public read access
-- ALTER TABLE stock_data ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access to stock data" ON stock_data FOR SELECT USING (true);