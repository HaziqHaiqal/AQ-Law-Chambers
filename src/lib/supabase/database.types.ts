export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      audit_events: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"];
          actor_id: string | null;
          case_id: number | null;
          created_at: string;
          document_id: number | null;
          id: number;
        };
        Insert: {
          action: Database["public"]["Enums"]["audit_action"];
          actor_id?: string | null;
          case_id?: number | null;
          created_at?: string;
          document_id?: number | null;
          id?: never;
        };
        Update: {
          action?: Database["public"]["Enums"]["audit_action"];
          actor_id?: string | null;
          case_id?: number | null;
          created_at?: string;
          document_id?: number | null;
          id?: never;
        };
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      case_members: {
        Row: {
          added_at: string;
          case_id: number;
          client_id: string;
        };
        Insert: {
          added_at?: string;
          case_id: number;
          client_id: string;
        };
        Update: {
          added_at?: string;
          case_id?: number;
          client_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_members_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_members_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_members_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      case_milestones: {
        Row: {
          case_id: number;
          completed_at: string | null;
          completed_by: string | null;
          note: string | null;
          scheduled_for: string | null;
          stage: Database["public"]["Enums"]["milestone_stage"];
          updated_at: string;
        };
        Insert: {
          case_id: number;
          completed_at?: string | null;
          completed_by?: string | null;
          note?: string | null;
          scheduled_for?: string | null;
          stage: Database["public"]["Enums"]["milestone_stage"];
          updated_at?: string;
        };
        Update: {
          case_id?: number;
          completed_at?: string | null;
          completed_by?: string | null;
          note?: string | null;
          scheduled_for?: string | null;
          stage?: Database["public"]["Enums"]["milestone_stage"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_milestones_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_milestones_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_milestones_completed_by_fkey";
            columns: ["completed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      case_updates: {
        Row: {
          author_id: string | null;
          body: string;
          case_id: number;
          category: Database["public"]["Enums"]["update_category"];
          created_at: string;
          id: number;
          occurred_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          body: string;
          case_id: number;
          category?: Database["public"]["Enums"]["update_category"];
          created_at?: string;
          id?: never;
          occurred_at?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          body?: string;
          case_id?: number;
          category?: Database["public"]["Enums"]["update_category"];
          created_at?: string;
          id?: never;
          occurred_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_updates_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_updates_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "case_updates_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
        ];
      };
      cases: {
        Row: {
          closed_at: string | null;
          court: string | null;
          court_reference: string | null;
          created_at: string;
          id: number;
          lead_partner_id: string | null;
          opened_at: string;
          relief_types: Database["public"]["Enums"]["relief_type"][];
          status: Database["public"]["Enums"]["case_status"];
          summary: string | null;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          closed_at?: string | null;
          court?: string | null;
          court_reference?: string | null;
          created_at?: string;
          id?: never;
          lead_partner_id?: string | null;
          opened_at?: string;
          relief_types?: Database["public"]["Enums"]["relief_type"][];
          status?: Database["public"]["Enums"]["case_status"];
          summary?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          closed_at?: string | null;
          court?: string | null;
          court_reference?: string | null;
          created_at?: string;
          id?: never;
          lead_partner_id?: string | null;
          opened_at?: string;
          relief_types?: Database["public"]["Enums"]["relief_type"][];
          status?: Database["public"]["Enums"]["case_status"];
          summary?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cases_lead_partner_id_fkey";
            columns: ["lead_partner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      document_comments: {
        Row: {
          author_id: string | null;
          body: string;
          created_at: string;
          document_id: number;
          edited_at: string | null;
          id: number;
          is_pinned: boolean;
        };
        Insert: {
          author_id?: string | null;
          body: string;
          created_at?: string;
          document_id: number;
          edited_at?: string | null;
          id?: never;
          is_pinned?: boolean;
        };
        Update: {
          author_id?: string | null;
          body?: string;
          created_at?: string;
          document_id?: number;
          edited_at?: string | null;
          id?: never;
          is_pinned?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "document_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_comments_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          case_id: number;
          category: Database["public"]["Enums"]["document_category"];
          created_at: string;
          exhibit_label: string | null;
          file_name: string;
          id: number;
          is_published: boolean;
          mime_type: string;
          published_at: string | null;
          size_bytes: number;
          storage_path: string;
          title: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          case_id: number;
          category: Database["public"]["Enums"]["document_category"];
          created_at?: string;
          exhibit_label?: string | null;
          file_name: string;
          id?: never;
          is_published?: boolean;
          mime_type: string;
          published_at?: string | null;
          size_bytes: number;
          storage_path: string;
          title: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          case_id?: number;
          category?: Database["public"]["Enums"]["document_category"];
          created_at?: string;
          exhibit_label?: string | null;
          file_name?: string;
          id?: never;
          is_published?: boolean;
          mime_type?: string;
          published_at?: string | null;
          size_bytes?: number;
          storage_path?: string;
          title?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enquiries: {
        Row: {
          case_id: number | null;
          client_id: string | null;
          contact_method: string | null;
          contacted_at: string | null;
          created_at: string;
          email: string;
          full_name: string;
          handled_by: string | null;
          id: number;
          invited_at: string | null;
          invited_via: string | null;
          is_urgent: boolean;
          message: string;
          outcome_at: string | null;
          outcome_note: string | null;
          phone: string | null;
          source: string;
          status: Database["public"]["Enums"]["enquiry_status"];
          topic: string | null;
          updated_at: string;
        };
        Insert: {
          case_id?: number | null;
          client_id?: string | null;
          contact_method?: string | null;
          contacted_at?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          handled_by?: string | null;
          id?: never;
          invited_at?: string | null;
          invited_via?: string | null;
          is_urgent?: boolean;
          message: string;
          outcome_at?: string | null;
          outcome_note?: string | null;
          phone?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["enquiry_status"];
          topic?: string | null;
          updated_at?: string;
        };
        Update: {
          case_id?: number | null;
          client_id?: string | null;
          contact_method?: string | null;
          contacted_at?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          handled_by?: string | null;
          id?: never;
          invited_at?: string | null;
          invited_via?: string | null;
          is_urgent?: boolean;
          message?: string;
          outcome_at?: string | null;
          outcome_note?: string | null;
          phone?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["enquiry_status"];
          topic?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enquiries_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enquiries_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enquiries_handled_by_fkey";
            columns: ["handled_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          amount: number;
          case_id: number;
          created_at: string;
          created_by: string | null;
          currency: string;
          description: string;
          due_on: string | null;
          file_path: string | null;
          id: number;
          invoice_number: string;
          issued_on: string | null;
          paid_at: string | null;
          status: Database["public"]["Enums"]["invoice_status"];
          tax_amount: number;
          total: number | null;
          updated_at: string;
        };
        Insert: {
          amount: number;
          case_id: number;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          description: string;
          due_on?: string | null;
          file_path?: string | null;
          id?: never;
          invoice_number: string;
          issued_on?: string | null;
          paid_at?: string | null;
          status?: Database["public"]["Enums"]["invoice_status"];
          tax_amount?: number;
          total?: number | null;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          case_id?: number;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          description?: string;
          due_on?: string | null;
          file_path?: string | null;
          id?: never;
          invoice_number?: string;
          issued_on?: string | null;
          paid_at?: string | null;
          status?: Database["public"]["Enums"]["invoice_status"];
          tax_amount?: number;
          total?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          case_id: number | null;
          created_at: string;
          id: number;
          kind: Database["public"]["Enums"]["notification_kind"];
          link: string | null;
          read_at: string | null;
          recipient_id: string;
          title: string;
        };
        Insert: {
          case_id?: number | null;
          created_at?: string;
          id?: never;
          kind: Database["public"]["Enums"]["notification_kind"];
          link?: string | null;
          read_at?: string | null;
          recipient_id: string;
          title: string;
        };
        Update: {
          case_id?: number | null;
          created_at?: string;
          id?: never;
          kind?: Database["public"]["Enums"]["notification_kind"];
          link?: string | null;
          read_at?: string | null;
          recipient_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      privacy_consents: {
        Row: {
          consented_at: string;
          id: number;
          notice_version: string;
          user_id: string;
          withdrawn_at: string | null;
        };
        Insert: {
          consented_at?: string;
          id?: never;
          notice_version: string;
          user_id: string;
          withdrawn_at?: string | null;
        };
        Update: {
          consented_at?: string;
          id?: never;
          notice_version?: string;
          user_id?: string;
          withdrawn_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "privacy_consents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          last_sign_in_at: string | null;
          organisation: string | null;
          phone: string | null;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          last_sign_in_at?: string | null;
          organisation?: string | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          last_sign_in_at?: string | null;
          organisation?: string | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          assigned_to: string;
          case_id: number | null;
          completed_at: string | null;
          created_at: string;
          created_by: string | null;
          details: string | null;
          due_at: string | null;
          id: number;
          status: Database["public"]["Enums"]["task_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          assigned_to: string;
          case_id?: number | null;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          details?: string | null;
          due_at?: string | null;
          id?: never;
          status?: Database["public"]["Enums"]["task_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string;
          case_id?: number | null;
          completed_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          details?: string | null;
          due_at?: string | null;
          id?: never;
          status?: Database["public"]["Enums"]["task_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "case_overview";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      case_overview: {
        Row: {
          client_names: string | null;
          completed_stages: number | null;
          court_reference: string | null;
          id: number | null;
          last_completed_stage:
            Database["public"]["Enums"]["milestone_stage"] | null;
          lead_partner_id: string | null;
          next_stage: Database["public"]["Enums"]["milestone_stage"] | null;
          next_stage_scheduled_for: string | null;
          next_task_assigned_to: string | null;
          next_task_due_at: string | null;
          next_task_id: number | null;
          next_task_title: string | null;
          opened_at: string | null;
          relief_types: Database["public"]["Enums"]["relief_type"][] | null;
          status: Database["public"]["Enums"]["case_status"] | null;
          title: string | null;
          updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cases_lead_partner_id_fkey";
            columns: ["lead_partner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["next_task_assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      app_role: "admin" | "client";
      audit_action:
        | "signed_in"
        | "document_downloaded"
        | "document_published"
        | "document_unpublished"
        | "milestone_completed";
      case_status: "intake" | "active" | "closed";
      document_category:
        | "emergency_cause_papers"
        | "sworn_testimony"
        | "evidence"
        | "court_directives"
        | "internal";
      enquiry_status:
        | "new"
        | "contacted"
        | "closed"
        | "signed_up"
        | "case_opened"
        | "not_proceeding";
      invoice_status: "draft" | "issued" | "paid" | "void";
      milestone_stage:
        | "ex_parte_filing"
        | "ex_parte_hearing"
        | "execution_service"
        | "inter_partes_return";
      notification_kind:
        | "document_published"
        | "case_update"
        | "milestone"
        | "comment"
        | "invoice";
      relief_type:
        | "mareva"
        | "worldwide_freezing"
        | "anton_piller"
        | "bankers_trust"
        | "norwich_pharmacal"
        | "other";
      task_status: "todo" | "in_progress" | "done";
      update_category:
        | "filing"
        | "court_order"
        | "execution"
        | "service"
        | "supervising_solicitor"
        | "compliance"
        | "forensic"
        | "general";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
      audit_action: [
        "signed_in",
        "document_downloaded",
        "document_published",
        "document_unpublished",
        "milestone_completed",
      ],
      case_status: ["intake", "active", "closed"],
      document_category: [
        "emergency_cause_papers",
        "sworn_testimony",
        "evidence",
        "court_directives",
        "internal",
      ],
      enquiry_status: [
        "new",
        "contacted",
        "closed",
        "signed_up",
        "case_opened",
        "not_proceeding",
      ],
      invoice_status: ["draft", "issued", "paid", "void"],
      milestone_stage: [
        "ex_parte_filing",
        "ex_parte_hearing",
        "execution_service",
        "inter_partes_return",
      ],
      notification_kind: [
        "document_published",
        "case_update",
        "milestone",
        "comment",
        "invoice",
      ],
      relief_type: [
        "mareva",
        "worldwide_freezing",
        "anton_piller",
        "bankers_trust",
        "norwich_pharmacal",
        "other",
      ],
      task_status: ["todo", "in_progress", "done"],
      update_category: [
        "filing",
        "court_order",
        "execution",
        "service",
        "supervising_solicitor",
        "compliance",
        "forensic",
        "general",
      ],
    },
  },
} as const;
