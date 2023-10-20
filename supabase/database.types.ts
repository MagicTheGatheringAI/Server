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
      catan_rules: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      games: {
        Row: {
          created: string
          game: string
          id: number
          launched: boolean
          parent_game: string | null
          pieces_db: string | null
          rules_db: string
          training_file: string
        }
        Insert: {
          created?: string
          game: string
          id?: number
          launched?: boolean
          parent_game?: string | null
          pieces_db?: string | null
          rules_db: string
          training_file: string
        }
        Update: {
          created?: string
          game?: string
          id?: number
          launched?: boolean
          parent_game?: string | null
          pieces_db?: string | null
          rules_db?: string
          training_file?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_parent_game_fkey"
            columns: ["parent_game"]
            referencedRelation: "games"
            referencedColumns: ["game"]
          }
        ]
      }
      lorcana_cards: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      lorcana_rules: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      magic_cards: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      magic_rules: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      training_ledger: {
        Row: {
          created_at: string
          db_table: string
          file_id: string
          file_name: string
          game: string
          hash: string
          id: number
        }
        Insert: {
          created_at?: string
          db_table: string
          file_id: string
          file_name: string
          game: string
          hash: string
          id?: number
        }
        Update: {
          created_at?: string
          db_table?: string
          file_id?: string
          file_name?: string
          game?: string
          hash?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_ledger_file_id_fkey"
            columns: ["file_id"]
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_ledger_game_fkey"
            columns: ["game"]
            referencedRelation: "games"
            referencedColumns: ["game"]
          }
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          invited: boolean
          referID: string
        }
        Insert: {
          created_at?: string
          email: string
          invited?: boolean
          referID: string
        }
        Update: {
          created_at?: string
          email?: string
          invited?: boolean
          referID?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      kw_match_cards: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      kw_match_catan_rules: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      kw_match_magic_rules: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_cards: {
        Args: {
          query_embedding: string
          match_count: number
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_catan_rules: {
        Args: {
          query_embedding: string
          match_count: number
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_magic_rules: {
        Args: {
          query_embedding: string
          match_count: number
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}