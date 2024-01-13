SELECT
  G.LINK,
  CASE GREATEST(G.ES, G.S, G.CS, G.C, G.CD, G.D, G.ED, G.NO)
    WHEN G.ES THEN 'ES'
    WHEN G.S THEN 'S'
    WHEN G.CS THEN 'CS'
    WHEN G.C THEN 'C'
    WHEN G.CD THEN 'CD'
    WHEN G.D THEN 'D'
    WHEN G.ED THEN 'ED'
    WHEN G.NO THEN 'NO'
  END AS OrientamentoPrincipale,
  GREATEST(G.ES, G.S, G.CS, G.C, G.CD, G.D, G.ED, G.NO) AS ValoreOrientamentoMassimo
FROM
  GIORNALI G

WHERE
  G.LINK = 'https://lespresso.it/';
