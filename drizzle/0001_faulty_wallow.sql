CREATE TABLE `department_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`department_id` text NOT NULL,
	`action` text NOT NULL,
	`changes` text,
	`performed_by` text,
	`performed_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `division_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`division_id` text NOT NULL,
	`action` text NOT NULL,
	`changes` text,
	`performed_by` text,
	`performed_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`division_id`) REFERENCES `divisions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `departments` ADD `description` text;--> statement-breakpoint
ALTER TABLE `departments` ADD `status` text DEFAULT 'Active';--> statement-breakpoint
ALTER TABLE `departments` ADD `manager_position_id` text;--> statement-breakpoint
ALTER TABLE `departments` ADD `cost_center` text;--> statement-breakpoint
ALTER TABLE `divisions` ADD `description` text;--> statement-breakpoint
ALTER TABLE `divisions` ADD `status` text DEFAULT 'Active';