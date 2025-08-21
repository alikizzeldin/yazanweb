-- Supabase Database Triggers for Real-time Message Updates
-- Run this SQL in your Supabase SQL Editor

-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to notify clients when messages change
CREATE OR REPLACE FUNCTION notify_message_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify all connected clients about the change
    PERFORM pg_notify('message_changes', json_build_object(
        'operation', TG_OP,
        'record', row_to_json(NEW)
    )::text);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
DROP TRIGGER IF EXISTS messages_insert_trigger ON messages;
CREATE TRIGGER messages_insert_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_message_changes();

-- Create trigger for UPDATE operations
DROP TRIGGER IF EXISTS messages_update_trigger ON messages;
CREATE TRIGGER messages_update_trigger
    AFTER UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_message_changes();

-- Create trigger for DELETE operations
DROP TRIGGER IF EXISTS messages_delete_trigger ON messages;
CREATE TRIGGER messages_delete_trigger
    AFTER DELETE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_message_changes();

-- Alternative: Create a more advanced function that can trigger webhooks
CREATE OR REPLACE FUNCTION trigger_message_webhook()
RETURNS TRIGGER AS $$
BEGIN
    -- You can add webhook calls here if needed
    -- Example: Call a webhook to notify external services
    
    -- For now, just notify connected clients
    PERFORM pg_notify('message_webhook', json_build_object(
        'event', 'message_' || TG_OP,
        'data', row_to_json(NEW),
        'timestamp', now()
    )::text);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create webhook trigger
DROP TRIGGER IF EXISTS messages_webhook_trigger ON messages;
CREATE TRIGGER messages_webhook_trigger
    AFTER INSERT OR UPDATE OR DELETE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION trigger_message_webhook();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON messages TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON messages TO authenticated;

-- Verify triggers are created
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'messages';
