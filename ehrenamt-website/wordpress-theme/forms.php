<?php
/**
 * Formulare „Aktiv werden“ und „Kontakt“ – laufen ohne JavaScript direkt über WordPress.
 * Anfragen werden im WP-Admin unter „Anfragen“ gespeichert und per E-Mail an die
 * Admin-Adresse geschickt (Einstellungen → Allgemein → Administrator-E-Mail).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/* Anfragen als eigener Bereich im WP-Admin */
add_action( 'init', function () {
	register_post_type( 'efd_anfrage', array(
		'labels'          => array(
			'name'          => 'Anfragen',
			'singular_name' => 'Anfrage',
			'menu_name'     => 'Anfragen',
			'all_items'     => 'Alle Anfragen',
			'edit_item'     => 'Anfrage ansehen',
			'not_found'     => 'Noch keine Anfragen.',
		),
		'public'          => false,
		'show_ui'         => true,
		'show_in_menu'    => true,
		'menu_position'   => 25,
		'menu_icon'       => 'dashicons-email-alt',
		'supports'        => array( 'title', 'editor' ),
		'capability_type' => 'post',
		'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		'map_meta_cap'    => true,
	) );
} );

function efd_field_class() {
	return 'mt-2 block w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-lg text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] dark:border-white/15 dark:bg-night dark:text-white';
}

function efd_field( $label, $name, $type = 'text', $required = false, $attrs = '' ) {
	$id  = 'efd-' . $name;
	$req = $required ? ' required' : '';
	$out = '<div><label for="' . esc_attr( $id ) . '" class="text-base font-medium">' . esc_html( $label ) . ( $required ? '<span class="text-ink-soft"> *</span>' : '' ) . '</label>';
	if ( 'textarea' === $type ) {
		$out .= '<textarea id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" rows="5" class="' . efd_field_class() . '"' . $req . ' ' . $attrs . '></textarea>';
	} else {
		$out .= '<input id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" type="' . esc_attr( $type ) . '" class="' . efd_field_class() . '"' . $req . ' ' . $attrs . '>';
	}
	return $out . '</div>';
}

function efd_chips( $name, $options, $type = 'checkbox', $required = false ) {
	$out = '<div class="mt-3 flex flex-wrap gap-2">';
	foreach ( $options as $i => $opt ) {
		$req  = ( $required && 'radio' === $type && 0 === $i ) ? ' required' : '';
		$out .= '<label class="efd-chip inline-flex min-h-11 cursor-pointer items-center rounded-full bg-paper px-5 text-base text-ink ring-1 ring-line transition-colors select-none hover:ring-ink/40">'
			. '<input class="sr-only" type="' . $type . '" name="' . esc_attr( $name ) . ( 'checkbox' === $type ? '[]' : '' ) . '" value="' . esc_attr( $opt ) . '"' . $req . '>'
			. esc_html( $opt ) . '</label>';
	}
	return $out . '</div>';
}

function efd_consent() {
	return '<label class="flex items-start gap-3 text-base"><input type="checkbox" name="efd_datenschutz" value="ja" required class="mt-1 size-5 shrink-0 accent-[#0071e3]">'
		. '<span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in der <a class="link" href="' . esc_url( home_url( '/datenschutz/' ) ) . '">Datenschutzerklärung</a>.</span></label>';
}

function efd_form_open( $type ) {
	return '<form method="post" action="' . esc_url( home_url( '/' ) ) . '" class="space-y-8">'
		. wp_nonce_field( 'efd_form', '_efd_nonce', true, false )
		. '<input type="hidden" name="efd_form" value="' . esc_attr( $type ) . '">'
		. '<input type="hidden" name="efd_back" value="' . esc_url( get_permalink() ) . '">'
		// Spam-Falle: für Menschen unsichtbar
		. '<div aria-hidden="true" style="position:absolute;left:-9999px"><label>Website<input type="text" name="efd_website" tabindex="-1" autocomplete="off"></label></div>';
}

function efd_button( $label ) {
	return '<div class="flex justify-end pt-2"><button type="submit" class="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-brand px-7 text-[1.05rem] font-medium text-white transition-[background-color,scale] hover:bg-[#0077ed] active:scale-[0.97]">' . esc_html( $label ) . '</button></div>';
}

function efd_success( $title, $text ) {
	return '<div role="status" class="py-10 text-center"><span class="mx-auto grid size-16 place-items-center rounded-full bg-[#34c759] text-white">'
		. '<svg aria-hidden="true" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>'
		. '<h3 class="mt-6 text-3xl">' . esc_html( $title ) . '</h3><p class="mx-auto mt-3 max-w-md text-lg text-ink-soft">' . esc_html( $text ) . '</p></div>';
}

function efd_error_box() {
	if ( empty( $_GET['efd_fehler'] ) ) { return ''; }
	return '<p role="alert" class="mb-6 rounded-2xl bg-[#fff2f2] p-4 text-base text-[#b00000]">Bitte füllen Sie alle Pflichtfelder (*) aus und stimmen Sie der Datenspeicherung zu.</p>';
}

add_shortcode( 'efd_aktiv_formular', function () {
	if ( ! empty( $_GET['gesendet'] ) ) {
		return efd_success( 'Danke für Ihre Anmeldung!', 'Ihre Angaben sind bei uns angekommen. Wir melden uns in den nächsten Tagen bei Ihnen.' );
	}
	$bereiche = array( 'Museen & Shops', 'Archive & Sammlungen', 'Musik & Theater', 'Parks & Denkmäler', 'Bildung & Lesen', 'Büro & Verein', 'Noch offen' );
	$zeiten   = array( 'Wenige Stunden im Monat', 'Etwa einmal pro Woche', 'Mehrmals pro Woche', 'Gelegentlich / spontan' );
	return efd_error_box() . efd_form_open( 'aktiv' )
		. '<fieldset class="space-y-6"><legend class="text-3xl font-semibold tracking-tight">1. Über Sie</legend>'
		. efd_field( 'Name', 'efd_name', 'text', true, 'autocomplete="name"' )
		. '<div class="grid gap-6 sm:grid-cols-2">' . efd_field( 'Alter (optional)', 'efd_alter', 'text', false, 'inputmode="numeric"' ) . efd_field( 'Wohnort (optional)', 'efd_ort' ) . '</div></fieldset>'
		. '<fieldset class="space-y-8"><legend class="text-3xl font-semibold tracking-tight">2. Ihre Interessen</legend>'
		. '<div><p class="text-base font-medium">Bereiche (Mehrfachauswahl)</p>' . efd_chips( 'efd_interessen', $bereiche ) . '</div>'
		. '<div><p class="text-base font-medium">Wie viel Zeit haben Sie? <span class="text-ink-soft">*</span></p>' . efd_chips( 'efd_zeit', $zeiten, 'radio', true ) . '</div>'
		. efd_field( 'Möchten Sie uns noch etwas sagen? (optional)', 'efd_nachricht', 'textarea' ) . '</fieldset>'
		. '<fieldset class="space-y-6"><legend class="text-3xl font-semibold tracking-tight">3. Kontakt</legend>'
		. efd_field( 'E-Mail', 'efd_email', 'email', true, 'autocomplete="email"' )
		. efd_field( 'Telefon (optional)', 'efd_telefon', 'tel', false, 'autocomplete="tel"' )
		. '<div><p class="text-base font-medium">Wie sollen wir uns melden?</p>' . efd_chips( 'efd_kontaktweg', array( 'E-Mail', 'Telefon' ), 'radio' ) . '</div>'
		. efd_consent() . '</fieldset>'
		. efd_button( 'Absenden' ) . '</form>';
} );

add_shortcode( 'efd_kontakt_formular', function () {
	if ( ! empty( $_GET['gesendet'] ) ) {
		return efd_success( 'Nachricht gesendet.', 'Danke! Wir melden uns so bald wie möglich bei Ihnen.' );
	}
	return efd_error_box() . efd_form_open( 'kontakt' )
		. '<div class="grid gap-6 sm:grid-cols-2">' . efd_field( 'Name', 'efd_name', 'text', true, 'autocomplete="name"' ) . efd_field( 'E-Mail', 'efd_email', 'email', true, 'autocomplete="email"' ) . '</div>'
		. efd_field( 'Betreff (optional)', 'efd_betreff' )
		. efd_field( 'Nachricht', 'efd_nachricht', 'textarea', true )
		. efd_consent() . efd_button( 'Nachricht senden' ) . '</form>';
} );

/* Absenden verarbeiten */
add_action( 'init', function () {
	if ( 'POST' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) || empty( $_POST['efd_form'] ) ) { return; }
	$type = sanitize_key( wp_unslash( $_POST['efd_form'] ) );
	$back = esc_url_raw( wp_unslash( $_POST['efd_back'] ?? home_url( '/' ) ) );
	$back = wp_validate_redirect( $back, home_url( '/' ) );
	$anchor = ( 'aktiv' === $type ) ? '#anmelden' : '';

	if ( ! wp_verify_nonce( $_POST['_efd_nonce'] ?? '', 'efd_form' ) || ! empty( $_POST['efd_website'] ) ) {
		wp_safe_redirect( $back ); exit;
	}
	$f = function ( $k ) { return sanitize_text_field( wp_unslash( $_POST[ $k ] ?? '' ) ); };
	$name  = $f( 'efd_name' );
	$email = sanitize_email( wp_unslash( $_POST['efd_email'] ?? '' ) );
	$msg   = sanitize_textarea_field( wp_unslash( $_POST['efd_nachricht'] ?? '' ) );
	$ok    = $name && is_email( $email ) && ! empty( $_POST['efd_datenschutz'] );
	if ( 'kontakt' === $type ) { $ok = $ok && $msg; }
	if ( 'aktiv' === $type ) { $ok = $ok && $f( 'efd_zeit' ); }
	if ( ! $ok ) {
		wp_safe_redirect( add_query_arg( 'efd_fehler', '1', $back ) . $anchor ); exit;
	}

	$rows = array( 'Name' => $name, 'E-Mail' => $email );
	if ( 'aktiv' === $type ) {
		$interessen = array_map( 'sanitize_text_field', (array) wp_unslash( $_POST['efd_interessen'] ?? array() ) );
		$rows += array(
			'Alter'      => $f( 'efd_alter' ),
			'Wohnort'    => $f( 'efd_ort' ),
			'Interessen' => implode( ', ', $interessen ),
			'Zeit'       => $f( 'efd_zeit' ),
			'Telefon'    => $f( 'efd_telefon' ),
			'Kontaktweg' => $f( 'efd_kontaktweg' ),
			'Nachricht'  => $msg,
		);
		$title = 'Aktiv werden: ' . $name;
	} else {
		$rows += array( 'Betreff' => $f( 'efd_betreff' ), 'Nachricht' => $msg );
		$title = 'Kontakt: ' . $name;
	}
	$text = '';
	foreach ( $rows as $k => $v ) {
		if ( '' !== $v ) { $text .= $k . ': ' . $v . "\n"; }
	}
	wp_insert_post( array( 'post_type' => 'efd_anfrage', 'post_status' => 'private', 'post_title' => $title, 'post_content' => $text ) );
	wp_mail( get_option( 'admin_email' ), '[Website] ' . $title, $text, array( 'Reply-To: ' . $name . ' <' . $email . '>' ) );

	wp_safe_redirect( add_query_arg( 'gesendet', '1', remove_query_arg( 'efd_fehler', $back ) ) . $anchor );
	exit;
} );
