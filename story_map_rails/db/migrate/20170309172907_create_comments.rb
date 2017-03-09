class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.integer :user_id
      t.integer :visual_id
      t.integer :comment_id
      t.string :content
      t.timestamps
    end
  end
end
