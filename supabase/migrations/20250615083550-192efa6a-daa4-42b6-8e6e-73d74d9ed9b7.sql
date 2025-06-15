
-- Drop the old trigger to avoid duplication
DROP TRIGGER IF EXISTS trigger_new_college_review ON public.college_reviews;

-- Replace the function to NOT reference resource_id in notifications for college reviews
CREATE OR REPLACE FUNCTION public.create_notification_for_new_college_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.notifications (user_id, message, category, resource_id)
  SELECT 
    id, 
    'New review added for college: ' || (SELECT name FROM colleges WHERE id = NEW.college_id),
    'reviews',
    NULL  -- Set resource_id to NULL to avoid FK violation!
  FROM auth.users;

  RETURN NEW;
END;
$function$;

-- Recreate the trigger with the new function reference
CREATE TRIGGER trigger_new_college_review
AFTER INSERT ON public.college_reviews
FOR EACH ROW
EXECUTE FUNCTION public.create_notification_for_new_college_review();

