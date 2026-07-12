CREATE TABLE `section_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`action` text NOT NULL,
	`changes` text,
	`performed_by` text,
	`performed_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `team_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`action` text NOT NULL,
	`changes` text,
	`performed_by` text,
	`performed_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `sections` ADD `description` text;--> statement-breakpoint
ALTER TABLE `sections` ADD `status` text DEFAULT 'Active';--> statement-breakpoint
ALTER TABLE `teams` ADD `description` text;--> statement-breakpoint
ALTER TABLE `teams` ADD `status` text DEFAULT 'Active';