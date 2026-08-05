import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  // The 2022–24 Governing Body is history, not deleted content — the schema
  // already models it with isCurrent:false. The 5.2 migration soft-deleted
  // every row its code-side source didn't list, which put 26 past office
  // bearers on a 30-day fuse: opening Recently deleted after 4 Sept would
  // have destroyed FAIITA's previous GB permanently.
  const { count } = await p.leader.updateMany({
    where: { deletedAt: { not: null }, isCurrent: false, term: "2022–2024" },
    data: { deletedAt: null },
  });
  console.log("restored past Governing Body rows:", count);
  console.log("leaders now — current:", await p.leader.count({ where: { isCurrent: true, deletedAt: null } }),
              "| past:", await p.leader.count({ where: { isCurrent: false, deletedAt: null } }),
              "| still in the bin:", await p.leader.count({ where: { deletedAt: { not: null } } }));
  await p.$disconnect();
})();
