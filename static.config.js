import React, { Component } from "react";
import { request } from "graphql-request";
import { SheetsRegistry } from "react-jss/lib/jss";
import JssProvider from "react-jss/lib/JssProvider";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName
} from "@material-ui/core/styles";

const GRAPHCMS_API = "https://api.graphcms.com/simple/v1/starterBlog";

const query = `{
  allPosts {
    id
    slug
    title
    coverImage {
      handle
    }
    content
  }
  allAuthors {
    id
    name
    avatar {
      handle
    }
    bibliography
  }
}`;

export default {
  siteRoot: "https://silly-goodall-3d66aa.netlify.com",
  renderToHtml: (render, Comp, meta) => {
    // Create a sheetsRegistry instance.
    const sheetsRegistry = new SheetsRegistry();

    // Create a MUI theme instance.
    const muiTheme = createMuiTheme();

    const generateClassName = createGenerateClassName();

    const html = render(
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider theme={muiTheme} sheetsManager={new Map()}>
          <Comp />
        </MuiThemeProvider>
      </JssProvider>
    );

    meta.jssStyles = sheetsRegistry.toString();

    return html;
  },
  Document: class CustomHtml extends Component {
    render() {
      const { Html, Head, Body, children, renderMeta } = this.props;

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link
              rel="stylesheet"
              type="text/css"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
            />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous"/>
            <style>{renderMeta.jssStyles}</style>
          </Head>
          <Body>
            {children}
          </Body>
        </Html>
      );
    }
  },
  getRoutes: async () => {
    const { allPosts, allAuthors } = await request(GRAPHCMS_API, query);

    return [
      {
        path: "/",
        component: "src/views/PresentationPage/PresentationPage"
      },
      {
        path: "/landing-page",
        component: "src/views/LandingPage/LandingPage"
      },
      {
        path: "/about-us",
        component: "src/views/AboutUsPage/AboutUsPage"
      },
      {
        path: "/blog-post",
        component: "src/views/BlogPostPage/BlogPostPage"
      },
      {
        path: "/blog-posts",
        component: "src/views/BlogPostsPage/BlogPostsPage"
      },
      {
        is404: true,
        component: "src/pages/404"
      }
    ];
  },
  webpack: (config, { stage }) => {
    if (stage === "prod") {
      config.entry = ["babel-polyfill", config.entry];
    } else if (stage === "dev") {
      config.entry = ["babel-polyfill", ...config.entry];
    }
    return config;
  }
};
