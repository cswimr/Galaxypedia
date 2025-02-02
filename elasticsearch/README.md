# Elasticsearch
This directory contains helper functions for interfacing with Elasticsearch, and the Galaxypedia's docker configuration for it.

## Background
The Galaxypedia is meant to be stateless and serverless. The goal from the start has been to ensure that the Galaxypedia can be run on any machine with no need for anything but the code and the outputted html.

However, a drawback of this minimalist approach is that implementing search functionality that is simple, lightweight, yet accurate is difficult. The Galaxypedia is a static site, and as such, it has no backend to handle search queries. This means that the search functionality must be implemented in the frontend (client sided).

The first search implementation was Pagefind. It checks two of the boxes, in that it's fast, lightweight, and simple. The problem is that it relies heavily on term frequency and doesn't provide that accurate of results. Compared to Elasticsearch, it's not even remotely close to being as accurate.

While Elasticsearch is a powerful search engine, it's not lightweight. It's a full-fledged search engine that requires a server to run. Because us Galaxypedia developers get high off of masochism, we decided to go with the best of both worlds. If an elasticsearch endpoint is provided in the hugo config, it is used. If not, we fall back to Pagefind.

## Contents
