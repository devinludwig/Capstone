Rails.application.routes.draw do
  get 'users/index'

  get 'users/show'

  devise_for :users, :controllers => { :registrations => "registrations" }
  get 'home/index'
  root to: 'home#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :users do
    resources :comments, only: [:create, :destroy, :edit, :update]
  end

  resources :visuals, only: [:create, :destroy]
end
