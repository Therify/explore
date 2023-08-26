-- inserts a row into public.profiles
create function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.users (id, email_address, given_name, surname)
values (
    new.id,
    new.email,
    raw_user_meta_data->>'givenName',
    raw_user_meta_data->>'surname'
  );
return new;
end;
$$;
-- trigger the function every time a user is created
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
