CREATE TABLE `consultation_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`message` text NOT NULL,
	`plan` text,
	`extras` text NOT NULL,
	`estimate` integer,
	`created_at` integer NOT NULL
);
