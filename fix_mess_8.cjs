const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

const addCode = `
export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  priority: one(ticketPriorities, {
    fields: [tickets.priorityId],
    references: [ticketPriorities.id],
  }),
  status: one(ticketStatuses, {
    fields: [tickets.statusId],
    references: [ticketStatuses.id],
  }),
  impact: one(ticketImpacts, {
    fields: [tickets.impactId],
    references: [ticketImpacts.id],
  }),
  urgency: one(ticketUrgencies, {
    fields: [tickets.urgencyId],
    references: [ticketUrgencies.id],
  }),
  category: one(ticketCategories, {
    fields: [tickets.categoryId],
    references: [ticketCategories.id],
  }),
  subCategory: one(ticketSubCategories, {
    fields: [tickets.subCategoryId],
    references: [ticketSubCategories.id],
  }),
  asset: one(assets, {
    fields: [tickets.assetId],
    references: [assets.id],
  }),
  contract: one(contracts, {
    fields: [tickets.contractId],
    references: [contracts.id],
  }),
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
  sla: one(slas, {
    fields: [tickets.slaId],
    references: [slas.id],
  }),
  assignedEmployee: one(employees, {
    fields: [tickets.assignedTo],
    references: [employees.id],
  }),
  reportedEmployee: one(employees, {
    fields: [tickets.reportedBy],
    references: [employees.id],
  }),
  comments: many(ticketComments),
  worklogs: many(ticketWorklogs),
  attachments: many(ticketAttachments),
  timelines: many(ticketTimelines),
  watchers: many(ticketWatchers),
  tags: many(ticketTags),
}));

export const ticketCategoriesRelations = relations(
  ticketCategories,
  ({ many }) => ({
    subCategories: many(ticketSubCategories),
    tickets: many(tickets),
  }),
);

export const ticketSubCategoriesRelations = relations(
  ticketSubCategories,
  ({ one, many }) => ({
    category: one(ticketCategories, {
      fields: [ticketSubCategories.categoryId],
      references: [ticketCategories.id],
    }),
    tickets: many(tickets),
  }),
);

export const ticketCommentsRelations = relations(
  ticketComments,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketComments.ticketId],
      references: [tickets.id],
    }),
    createdByEmployee: one(employees, {
      fields: [ticketComments.createdBy],
      references: [employees.id],
    }),
  }),
);

export const ticketWorklogsRelations = relations(
  ticketWorklogs,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketWorklogs.ticketId],
      references: [tickets.id],
    }),
    employee: one(employees, {
      fields: [ticketWorklogs.employeeId],
      references: [employees.id],
    }),
  }),
);

export const ticketAttachmentsRelations = relations(
  ticketAttachments,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketAttachments.ticketId],
      references: [tickets.id],
    }),
    createdByEmployee: one(employees, {
      fields: [ticketAttachments.createdBy],
      references: [employees.id],
    }),
  }),
);

export const ticketTimelinesRelations = relations(
  ticketTimelines,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketTimelines.ticketId],
      references: [tickets.id],
    }),
    createdByEmployee: one(employees, {
      fields: [ticketTimelines.createdBy],
      references: [employees.id],
    }),
  }),
);

export const ticketWatchersRelations = relations(
  ticketWatchers,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketWatchers.ticketId],
      references: [tickets.id],
    }),
    employee: one(employees, {
      fields: [ticketWatchers.employeeId],
      references: [employees.id],
    }),
  }),
);

export const tagsRelations = relations(tags, ({ many }) => ({
  tickets: many(ticketTags),
}));

export const ticketTagsRelations = relations(ticketTags, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketTags.ticketId],
    references: [tickets.id],
  }),
  tag: one(tags, {
    fields: [ticketTags.tagId],
    references: [tags.id],
  }),
}));

export const slasRelations = relations(slas, ({ one, many }) => ({
  priority: one(ticketPriorities, {
    fields: [slas.priorityId],
    references: [ticketPriorities.id],
  }),
  tickets: many(tickets),
}));

`;

code = code + '\n' + addCode;
fs.writeFileSync(file, code);

