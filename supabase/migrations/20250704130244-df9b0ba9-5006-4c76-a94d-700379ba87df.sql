-- Insert initial stock data if none exists
INSERT INTO stock_data (symbol, name, price, change, change_percent) VALUES
('AAPL', 'Apple Inc.', 178.72, 1.24, '+0.70%'),
('MSFT', 'Microsoft Corporation', 415.26, -2.43, '-0.58%'),
('GOOGL', 'Alphabet Inc.', 141.80, 0.92, '+0.65%'),
('AMZN', 'Amazon.com Inc.', 153.32, -1.88, '-1.21%'),
('NVDA', 'NVIDIA Corporation', 451.48, 8.72, '+1.97%'),
('TSLA', 'Tesla Inc.', 253.80, -4.22, '-1.64%'),
('META', 'Meta Platforms Inc.', 501.45, 2.15, '+0.43%')
ON CONFLICT (symbol) DO NOTHING;