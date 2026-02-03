use tauri::{webview::WebviewWindowBuilder, WebviewUrl};
use tauri::{Manager, Theme, Window};

mod hook;

#[tauri::command]
fn set_window_visible(window: Window, visible: bool) {
    if visible {
        let _ = window.show();
    } else {
        let _ = window.hide();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // also requires update of src-tauri/capabilities/default.json
    let port: u16 = 1420;

    tauri::Builder::default()
        // .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| {
            let url = format!("http://localhost:{}", port).parse().unwrap();
            WebviewWindowBuilder::new(app, "main".to_string(), WebviewUrl::External(url))
                .title("WCorp: Commanding interface")
                .inner_size(450.0, 200.0)
                .always_on_top(true)
                .visible(false)
                .decorations(false)
                .maximized(true)
                .transparent(true)
                .theme(Some(Theme::Dark))
                .build()?;
            let window = app.get_webview_window("main").unwrap();
            hook::start_global_mouse_stream(window);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_window_visible])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
