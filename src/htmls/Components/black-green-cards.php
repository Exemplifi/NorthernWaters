<?php
// Set default values if variables are not already defined

if (!isset($black_title)) {
  $black_title = "Capturing Data From Our Projects";
}

if (!isset($black_desc)) {
  $black_desc = "Northern Water collects real-time flow data for the Colorado-Big Thompson Project and Windy Gap Project. The data for selected canals, streams, rivers, reservoirs and watersheds can be viewed and downloaded through our website portal.";
}

if (!isset($black_btn_label)) {
  $black_btn_label = "Northern Water Data Portal";
}

if (!isset($black_btn_link)) {
  $black_btn_link = "#";
}

if (!isset($green_title)) {
  $green_title = "State of Colorado Data";
}

if (!isset($green_desc)) {
  $green_desc = "Northern Water pushes its data to the State of Colorado, which is available on the state's data portal.";
}

if (!isset($green_btn_label)) {
  $green_btn_label = "State of Colorado Portal";
}

if (!isset($green_btn_link)) {
  $green_btn_link = "#";
}
?>

<!-- Black and Green Cards component starts here -->
<div class="container-fluid black-green-cards-container-full">
  <div class="container black-green-cards-container">
    <div class="row">
      <div class="col-12 p-0">
        <div class="black-green-cards-wrapper">

          <!-- Black Card -->
          <div class="black-card">
            <div class="black-card-content">
              <h2 class="black-card-content-title"><?php echo $black_title; ?></h2>
              <section class="black-card-content-text">
                <p><?php echo $black_desc; ?></p>
              </section>
              <!-- Button -->
              <a href="<?php echo $black_btn_link; ?>"
                 class="btn secondary-btn d-inline-flex align-items-center liquid-animation"
                 role="button"
                 aria-label="<?php echo $black_btn_label; ?>"
                 tabindex="0"
                 data-button-type="secondary">
                <div class="secondary-btn-wrap norm liquid-animation-items liquid-animation-bg">
                  <span class="btn-text"><?php echo $black_btn_label; ?></span>
                  <!-- You can keep SVG arrow code here -->
                </div>
              </a>
            </div>
          </div>

          <!-- Green Card -->
          <div class="green-card">
            <div class="green-card-content">
              <h2 class="green-card-content-title"><?php echo $green_title; ?></h2>
              <section class="green-card-content-text">
                <p><?php echo $green_desc; ?></p>
              </section>
              <!-- Button -->
              <a href="<?php echo $green_btn_link; ?>"
                 class="btn secondary-btn d-inline-flex align-items-center liquid-animation"
                 role="button"
                 aria-label="<?php echo $green_btn_label; ?>"
                 tabindex="0"
                 data-button-type="secondary">
                <div class="secondary-btn-wrap norm liquid-animation-items liquid-animation-bg">
                  <span class="btn-text"><?php echo $green_btn_label; ?></span>
                  <!-- You can keep SVG arrow code here -->
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
<!-- Black and Green Cards component ends here -->
