-- Find developer by name, email, or uuid[D[D[D[D
SELECT uuid, name, email, technical_email, state, country
  FROM meta.developer
 WHERE name like '%{input}%' 
    OR uuid = '{input}'
    OR email like '%{input}%'
    OR technical_email like '%{input}%'
