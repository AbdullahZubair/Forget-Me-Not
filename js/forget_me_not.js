(function ($) {
  Drupal.behaviors.forgetMeNot = {
    attach: function (context, settings) {
      // Function to create and display messages
      function showMessage(type, message) {
        // Check if the message container already exists
        var messageContainer = $('#message-area');
        
        // If not, create the container and append it just before the list
        if (messageContainer.length === 0) {
          messageContainer = $('<div id="message-area" aria-live="polite"></div>');
          $('#excluded-modules-list').before(messageContainer);
        }

        // Add the message to the container with ARIA attributes
        var messageHtml = '<div class="' + type + '" role="alert">' + Drupal.t(message) + '</div>';
        messageContainer.html(messageHtml);
      }

      // Function to clear the message
      function clearMessage() {
        var messageContainer = $('#message-area');
        if (messageContainer.length > 0) {
          messageContainer.remove(); // Remove the message container when not needed
        }
      }

      // Remove module functionality
      $('.remove-module', context).once('remove-module').click(function () {
        var moduleName = $(this).data('module');

        $.post(Drupal.settings.basePath + 'admin/config/system/forget_me_not/remove_module', {
          module: moduleName
        }, function (response) {
          if (response.status === 'success') {
            $('#module-' + moduleName).remove();
            // Check if any modules are left; if not, show a message
            if ($('#excluded-modules-list li').length === 0) {
              $('#excluded-modules-list').replaceWith('<p>' + Drupal.t('No modules have been excluded yet.') + '</p>');
              clearMessage(); // Clear message if list is empty
            } else {
              // Show success message if not empty
              showMessage('success', 'Module removed successfully.');
            }
          } else {
            // Show error message
            showMessage('error', 'An error occurred while trying to remove the module.');
          }
        }).fail(function () {
          // Show failure message
          showMessage('error', 'Failed to communicate with the server. Please try again later.');
        });
      });

      // Add modules functionality
      $('#add-modules-button', context).once('add-modules-button').click(function () {
        window.location.href = Drupal.settings.basePath + 'admin/config/system/forget_me_not/select_modules';
      });
    }
  };
})(jQuery);
