
-- Trigger function and trigger for college_reviews (new review)
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
    NEW.college_id
  FROM auth.users
  WHERE id IS NOT DISTINCT FROM id;  -- all users

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_new_college_review ON public.college_reviews;

CREATE TRIGGER trigger_new_college_review
AFTER INSERT ON public.college_reviews
FOR EACH ROW
EXECUTE FUNCTION public.create_notification_for_new_college_review();


-- Trigger function and trigger for forum_questions (new question)
CREATE OR REPLACE FUNCTION public.create_notification_for_new_forum_question()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.notifications (user_id, message, category, resource_id)
  SELECT 
    id, 
    'New forum question: ' || NEW.title,
    'forum',
    NULL
  FROM auth.users
  WHERE id IS NOT DISTINCT FROM id;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trigger_new_forum_question ON public.forum_questions;

CREATE TRIGGER trigger_new_forum_question
AFTER INSERT ON public.forum_questions
FOR EACH ROW
EXECUTE FUNCTION public.create_notification_for_new_forum_question();
