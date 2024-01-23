SELECT
-- the aim of this query is that of selecting the highest political orientation for each newspaper analysed 
-- selecting the column LINK from the table GIORNALI
  G.LINK,
  -- in the next passage, we use GREATEST to select the highest political orientation for each newspaper, assigning
  -- a value to it using CASE. The clause WHEN THEN allows us to exclude all the values that are not the highest
  (CASE GREATEST(G.ES, G.S, G.CS, G.C, G.CD, G.D, G.ED, G.NO)
    WHEN G.ES THEN 'ES'
    WHEN G.S THEN 'S'
    WHEN G.CS THEN 'CS'
    WHEN G.C THEN 'C'
    WHEN G.CD THEN 'CD'
    WHEN G.D THEN 'D'
    WHEN G.ED THEN 'ED'
    WHEN G.NO THEN 'NO'
  END) AS OrientamentoPrincipale
  -- by doing so, the main political orientation in each newspaper will be stored in a column called OrientamentoPrincipale
FROM
  GIORNALI G
  -- in this passage we want to extract the information for Lespresso, so we use WHERE once more
WHERE
G.IDGIORNALE = CheckDomains()