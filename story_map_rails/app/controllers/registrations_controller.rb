class RegistrationsController < Devise::RegistrationsController
 prepend_before_filter :require_no_authentication, :only => [ :new, :create, :cancel ]

  protected

  def sign_up_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :current_password, :avatar)
  end

  def account_update_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :current_password, :avatar)
  end
end
