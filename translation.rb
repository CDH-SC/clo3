table "admin_panel_document" do
	column "id", :key, :as => :integer
	column "docfile", :string
end

table "admin_panel_message" do
	column "id", :key, :as => :integer
	column "date", :string
	column "sender", :string
	column "email", :string
	column "subject", :string
	column "message", :text
	column "permission", :boolean
end

table "analytics_browserreport" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "browser", :string
	column "hits", :integer
end

table "analytics_countryreport" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "country", :string
	column "hits", :integer
end

table "analytics_filereport" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "path", :string
	column "hits", :integer
end

table "analytics_hostreport" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "host", :string
	column "hits", :integer
end

table "analytics_pagereport" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "path", :string
	column "hits", :integer
end

table "analytics_refreport" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "site", :string
	column "hits", :integer
end

table "analytics_searchquery" do
	column "id", :key, :as => :integer
	column "report_id", :string, :references => "reports"
	column "advanced", :boolean
	column "query", :string
	column "hits", :integer
end

table "analytics_sitepath" do
	column "path", :string
end

table "analytics_visitorisfrom" do
	column "id", :key, :as => :integer
	column "visitor_id", :integer, :references => "visitors"
	column "country", :string
end

table "analytics_visitorprofile" do
	column "id", :key, :as => :integer
	column "browser", :string
	column "os", :string
	column "arch", :string
	column "ip", :string
	column "hostname", :string
end

table "analytics_webrequest" do
	column "id", :key, :as => :integer
	column "visitor_id", :integer, :references => "visitors"
	column "path_id", :string, :references => "paths"
	column "ref", :string
	column "query_string", :string
	column "timestamp", :datetime
	column "response_size", :integer
end

table "analytics_weeklyserverreport" do
	column "datestring", :string
	column "n_success", :integer
	column "n_failed", :integer
	column "n_dist_files", :integer
	column "n_dist_hosts", :integer
	column "n_data_out", :integer
	column "n_hits_mon", :integer
	column "n_hits_tue", :integer
	column "n_hits_wed", :integer
	column "n_hits_thu", :integer
	column "n_hits_fri", :integer
	column "n_hits_sat", :integer
	column "n_hits_sun", :integer
	column "n_hits_12am", :integer
	column "n_hits_1am", :integer
	column "n_hits_2am", :integer
	column "n_hits_3am", :integer
	column "n_hits_4am", :integer
	column "n_hits_5am", :integer
	column "n_hits_6am", :integer
	column "n_hits_7am", :integer
	column "n_hits_8am", :integer
	column "n_hits_9am", :integer
	column "n_hits_10am", :integer
	column "n_hits_11am", :integer
	column "n_hits_12pm", :integer
	column "n_hits_1pm", :integer
	column "n_hits_2pm", :integer
	column "n_hits_3pm", :integer
	column "n_hits_4pm", :integer
	column "n_hits_5pm", :integer
	column "n_hits_6pm", :integer
	column "n_hits_7pm", :integer
	column "n_hits_8pm", :integer
	column "n_hits_9pm", :integer
	column "n_hits_10pm", :integer
	column "n_hits_11pm", :integer
end

table "archive_album" do
	column "number", :integer
end

table "archive_captions" do
	column "volume", :integer
	column "text", :text
end

table "archive_extracontent" do
	column "xml_id", :string, :references => "xmls"
	column "name", :string
	column "volume_id", :integer, :references => "volumes"
	column "textClean", :text
	column "page", :integer
end

table "archive_extracontenthassubject" do
	column "id", :key, :as => :integer
	column "extracontent_id", :string, :references => "extracontents"
	column "subject_id", :string, :references => "subjects"
end

table "archive_folder" do
	column "id", :key, :as => :integer
	column "user_id", :integer, :references => "users"
	column "name", :string
end

table "archive_folderhasletter" do
	column "id", :key, :as => :integer
	column "folder_id", :integer, :references => "folders"
	column "letter_id", :string, :references => "letters"
end

table "archive_footnote" do
	column "footnote_id", :string, :references => "footnotes"
	column "letter_id", :string, :references => "letters"
	column "number", :integer
	column "footnote", :text
end

table "archive_image" do
	column "id", :key, :as => :integer
	column "image", :string
	column "uploaded_at", :datetime
	column "leaf", :string
	column "imgDate", :string
	column "caption", :string
	column "title", :string
	column "creator", :string
	column "contributor", :string
	column "type", :string
	column "medium", :string
	column "date", :string
	column "dimensions", :string
	column "description", :string
	column "subject", :string
	column "localSubject", :string
	column "timePeriod", :string
	column "location", :string
	column "album_id", :integer, :references => "albums"
end

table "archive_letter" do
	column "xml_id", :string, :references => "xmls"
	column "volume_id", :integer, :references => "volumes"
	column "docDate", :string
	column "firstpage", :string
	column "lastpage", :string
	column "docAuthor", :string
	column "sender", :string
	column "recipient", :string
	column "sourceNote", :text
	column "textClean", :text
	column "next_id", :string, :references => "nexts"
	column "prev_id", :string, :references => "prevs"
end

table "archive_letterhasmanuscript" do
	column "id", :key, :as => :integer
	column "letter_id", :string, :references => "letters"
	column "manuscript_id", :string, :references => "manuscripts"
end

table "archive_letterhasrecipient" do
	column "id", :key, :as => :integer
	column "letter_id", :string, :references => "letters"
	column "recipient_id", :string, :references => "recipients"
end

table "archive_letterhasrevision" do
	column "id", :key, :as => :integer
	column "letter_id", :string, :references => "letters"
	column "revisionFile_id", :integer, :references => "revisionfiles"
end

table "archive_letterhassubject" do
	column "id", :key, :as => :integer
	column "subject_id", :string, :references => "subjects"
	column "letter_id", :string, :references => "letters"
end

table "archive_manuscript" do
	column "letter_id", :string, :references => "letters"
	column "link", :string
end

table "archive_query" do
	column "query_id", :integer, :references => "queries"
	column "user_id", :integer, :references => "users"
	column "query", :string
	column "advanced", :boolean
	column "startDate", :string
	column "endDate", :string
end

table "archive_recipientterm" do
	column "recipient_name", :string
end

table "archive_resetrequest" do
	column "id", :key, :as => :integer
	column "token", :string
	column "user_id", :integer, :references => "users"
end

table "archive_revisionhistory" do
	column "id", :key, :as => :integer
	column "letter", :string
	column "name", :string
	column "path", :string
end

table "archive_subjectterm" do
	column "subject_name", :string
end

table "archive_testmodel" do
	column "number", :integer
	column "string", :string
end

table "archive_userhaslock" do
	column "letter_id", :string, :references => "letters"
	column "user_id", :integer, :references => "users"
end

table "archive_userprofile" do
	column "id", :key, :as => :integer
	column "user_id", :integer, :references => "users"
	column "superuser", :boolean
	column "admin", :boolean
end

table "archive_volume" do
	column "number", :integer
	column "path", :string
end

table "auth_group" do
	column "id", :key, :as => :integer
	column "name", :string
end

table "auth_group_permissions" do
	column "id", :key, :as => :integer
	column "group_id", :integer, :references => "groups"
	column "permission_id", :integer, :references => "permissions"
end

table "auth_permission" do
	column "id", :key, :as => :integer
	column "name", :string
	column "content_type_id", :integer, :references => "content_types"
	column "codename", :string
end

table "auth_user" do
	column "id", :key, :as => :integer
	column "password", :string
	column "last_login", :datetime
	column "is_superuser", :boolean
	column "username", :string
	column "first_name", :string
	column "last_name", :string
	column "email", :string
	column "is_staff", :boolean
	column "is_active", :boolean
	column "date_joined", :datetime
end

table "auth_user_groups" do
	column "id", :key, :as => :integer
	column "user_id", :integer, :references => "users"
	column "group_id", :integer, :references => "groups"
end

table "auth_user_user_permissions" do
	column "id", :key, :as => :integer
	column "user_id", :integer, :references => "users"
	column "permission_id", :integer, :references => "permissions"
end

table "django_admin_log" do
	column "id", :key, :as => :integer
	column "action_time", :datetime
	column "user_id", :integer, :references => "users"
	column "content_type_id", :integer, :references => "content_types"
	column "object_id", :text, :references => "objects"
	column "object_repr", :string
	column "action_flag", :integer
	column "change_message", :text
end

table "django_content_type" do
	column "id", :key, :as => :integer
	column "app_label", :string
	column "model", :string
end

table "django_migrations" do
	column "id", :key, :as => :integer
	column "app", :string
	column "name", :string
	column "applied", :datetime
end

table "django_session" do
	column "session_key", :string
	column "session_data", :text
	column "expire_date", :datetime
end

table "ip2nation" do
	column "ip", :integer
	column "country", :string
end

table "ip2nationCountries" do
	column "code", :string
	column "iso_code_2", :string
	column "iso_code_3", :string
	column "iso_country", :string
	column "country", :string
	column "lat", :float
	column "lon", :float
end
