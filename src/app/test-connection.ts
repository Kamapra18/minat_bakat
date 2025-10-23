// test-connection.ts
import { supabase } from '@/supabase/connection';

export async function testSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...');
  
  try {
    // Test basic select
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .limit(1);
    
    console.log('Connection test result:', { data, error });
    return { success: !error, error };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err };
  }
}