export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          start_time: string
          end_time: string
          type: string
          linked_skill: string | null
          linked_project: string | null
          notes: string | null
          checklist: Json
          completed: boolean
          color: string | null
          is_subscription_event: boolean | null
          linked_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          start_time: string
          end_time: string
          type: string
          linked_skill?: string | null
          linked_project?: string | null
          notes?: string | null
          checklist?: Json
          completed?: boolean
          color?: string | null
          is_subscription_event?: boolean | null
          linked_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          start_time?: string
          end_time?: string
          type?: string
          linked_skill?: string | null
          linked_project?: string | null
          notes?: string | null
          checklist?: Json
          completed?: boolean
          color?: string | null
          is_subscription_event?: boolean | null
          linked_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          deadline: string
          linked_projects: string[]
          progress: number
          status: string
          color_tag: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          deadline: string
          linked_projects?: string[]
          progress?: number
          status: string
          color_tag: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          deadline?: string
          linked_projects?: string[]
          progress?: number
          status?: string
          color_tag?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          status: string
          completion: number
          linked_skills: string[]
          linked_goals: string[]
          tasks: Json
          notes: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          status: string
          completion?: number
          linked_skills?: string[]
          linked_goals?: string[]
          tasks?: Json
          notes?: string | null
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          status?: string
          completion?: number
          linked_skills?: string[]
          linked_goals?: string[]
          tasks?: Json
          notes?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          focus_hours: number
          projects_applied: string[]
          last_used: string
          work_types: string[]
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          focus_hours?: number
          projects_applied?: string[]
          last_used: string
          work_types?: string[]
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          focus_hours?: number
          projects_applied?: string[]
          last_used?: string
          work_types?: string[]
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          service_name: string
          cost: number
          billing_cycle: string
          next_renewal: string
          category: string
          payment_method: string | null
          notes: string | null
          active: boolean
          auto_renew: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_name: string
          cost: number
          billing_cycle: string
          next_renewal: string
          category: string
          payment_method?: string | null
          notes?: string | null
          active?: boolean
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_name?: string
          cost?: number
          billing_cycle?: string
          next_renewal?: string
          category?: string
          payment_method?: string | null
          notes?: string | null
          active?: boolean
          auto_renew?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
